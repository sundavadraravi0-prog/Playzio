import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Shop.css';

const CATEGORIES = ['All', 'Action Figures', 'Board Games', 'Building Blocks', 'Dolls', 'Educational', 'Outdoor', 'Puzzles', 'Vehicles', 'Arts & Crafts', 'Stuffed Animals'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { sort, page, limit: 12 };
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const { data } = await productAPI.getAll(params);
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="page" id="shop-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Toy Shop</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            {search ? `Results for "${search}"` : `${total} toys available`}
          </p>
        </div>

        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className={`shop-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="close-filters" onClick={() => setShowFilters(false)}><FaTimes /></button>
            </div>
            
            <div className="filter-group">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`filter-chip ${category === cat ? 'active' : ''}`}
                    onClick={() => updateParam('category', cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4 className="filter-title">Sort By</h4>
              <select className="form-select" value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="shop-content">
            <div className="shop-toolbar">
              <button className="btn btn-secondary btn-sm filter-toggle" onClick={() => setShowFilters(true)}>
                <FaFilter /> Filters
              </button>
              <span className="results-count">{total} products</span>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3 className="empty-state-title">No toys found</h3>
                <p className="empty-state-text">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="grid-products">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} hideStars={true} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`pagination-btn ${p === page ? 'active' : ''}`}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.set('page', p);
                          setSearchParams(params);
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
